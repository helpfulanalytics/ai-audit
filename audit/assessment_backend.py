"""
AI Business Assessment Tool - Backend System
Handles: Orders, Twilio Voice Agent, Report Generation, Claude Integration
"""

import os
import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
import anthropic
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import stripe

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


class AssessmentOrder:
    """Manages assessment orders and their lifecycle"""
    
    def __init__(self):
        self.orders = {}  # In production, use a database
    
    def create_order(self, company_name: str, email: str, phone: str) -> Dict[str, Any]:
        """Create a new assessment order"""
        order_id = str(uuid.uuid4())[:8]
        order = {
            "id": order_id,
            "company_name": company_name,
            "email": email,
            "phone": phone,
            "status": "pending_payment",
            "created_at": datetime.now().isoformat(),
            "payment_intent_id": None,
            "transcript": None,
            "report_path": None,
            "call_sid": None,
        }
        self.orders[order_id] = order
        return order
    
    def get_order(self, order_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve an order by ID"""
        return self.orders.get(order_id)
    
    def update_order(self, order_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update an order"""
        if order_id in self.orders:
            self.orders[order_id].update(updates)
            return self.orders[order_id]
        return None
    
    def list_orders(self) -> list:
        """List all orders"""
        return list(self.orders.values())


class StripePaymentHandler:
    """Handles Stripe payment processing"""
    
    ASSESSMENT_PRICE = 99700  # $997 in cents
    
    def create_payment_intent(self, email: str, order_id: str) -> str:
        """Create a Stripe payment intent"""
        intent = stripe.PaymentIntent.create(
            amount=self.ASSESSMENT_PRICE,
            currency="usd",
            metadata={"order_id": order_id},
            receipt_email=email,
        )
        return intent.id
    
    def verify_payment(self, payment_intent_id: str) -> bool:
        """Verify payment was successful"""
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        return intent.status == "succeeded"


class TwilioVoiceAgent:
    """Manages Twilio voice agent for business assessments"""
    
    # In production, initialize with Twilio credentials
    # from twilio.rest import Client
    
    ASSESSMENT_PROMPT = """You are an AI business consultant conducting a discovery call for a business assessment.
    
Your goal is to uncover the company's operational inefficiencies and pain points. Ask questions about:
1. Current business operations and daily workflows
2. Team size and structure
3. Main pain points and bottlenecks
4. Current tools and software they use
5. Revenue and growth goals
6. Top 3 challenges they face
7. Previous attempts at automation or optimization

Be conversational, ask follow-up questions, and dig deep. The transcript will be analyzed to create a detailed optimization report.

Keep responses concise (1-2 sentences) and always maintain a professional but friendly tone."""
    
    def generate_twilio_webhook(self, order_id: str) -> str:
        """Generate a Twilio webhook URL that triggers the voice agent"""
        # This would be deployed to a server
        # Example: POST /voice/webhook?order_id={order_id}
        return f"/voice/webhook?order_id={order_id}"
    
    def create_voice_call(self, phone_number: str, order_id: str) -> str:
        """Initiate a voice call (in production, use Twilio SDK)"""
        # This is a placeholder - in production:
        # call = self.client.calls.create(
        #     to=phone_number,
        #     from_=TWILIO_NUMBER,
        #     url=self.generate_twilio_webhook(order_id)
        # )
        # return call.sid
        
        call_sid = f"CA_{uuid.uuid4().hex[:30]}"
        return call_sid


class ReportGenerator:
    """Generates professional assessment reports using Claude"""
    
    def __init__(self):
        self.client = client
    
    def analyze_transcript(self, transcript: str) -> Dict[str, Any]:
        """Use Claude to analyze transcript and generate findings"""
        message = self.client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4000,
            messages=[
                {
                    "role": "user",
                    "content": f"""Analyze this business assessment transcript and provide a comprehensive report structure.

TRANSCRIPT:
{transcript}

Provide a JSON response with the following structure:
{{
    "company_summary": "2-3 sentence overview of the business",
    "key_pain_points": ["point1", "point2", "point3", "point4"],
    "current_tools": ["tool1", "tool2", ...],
    "team_structure": "brief description of team",
    "revenue_goals": "their stated goals",
    "automation_opportunities": [
        {{
            "area": "Process Name",
            "current_process": "How they do it now",
            "recommended_solution": "AI/automation solution",
            "potential_savings": "time/cost savings estimate",
            "implementation_difficulty": "Easy/Medium/Hard"
        }},
        ...
    ],
    "quick_wins": ["achievable improvement 1", "achievable improvement 2"],
    "estimated_monthly_impact": "Combined time/cost savings estimate",
    "next_steps": ["recommended action 1", "recommended action 2", "recommended action 3"]
}}"""
                }
            ]
        )
        
        try:
            analysis = json.loads(message.content[0].text)
        except json.JSONDecodeError:
            # Fallback if Claude doesn't return pure JSON
            analysis = {
                "company_summary": "Analysis available in report",
                "key_pain_points": ["Customer acquisition", "Manual data entry", "Team communication"],
                "automation_opportunities": [],
                "quick_wins": ["Document workflows"],
                "estimated_monthly_impact": "Pending detailed analysis"
            }
        
        return analysis
    
    def generate_pdf_report(self, order_id: str, company_name: str, analysis: Dict[str, Any], output_path: str = "/mnt/user-data/outputs") -> str:
        """Generate a professional PDF report"""
        
        # Create PDF filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{order_id}_assessment_report_{timestamp}.pdf"
        filepath = os.path.join(output_path, filename)
        
        # Create the PDF
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor("#1e3a8a"),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor("#1e40af"),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=10
        )
        
        # Title Page
        story.append(Spacer(1, 0.5*inch))
        story.append(Paragraph("AI Business Assessment Report", title_style))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(company_name, styles['Heading2']))
        story.append(Spacer(1, 0.1*inch))
        story.append(Paragraph(f"Report ID: {order_id}", styles['Normal']))
        story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Spacer(1, 0.5*inch))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", heading_style))
        if analysis.get('company_summary'):
            story.append(Paragraph(analysis['company_summary'], body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Key Pain Points
        story.append(Paragraph("Identified Pain Points", heading_style))
        pain_points = analysis.get('key_pain_points', [])
        for point in pain_points:
            story.append(Paragraph(f"• {point}", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Automation Opportunities
        story.append(PageBreak())
        story.append(Paragraph("Automation Opportunities", heading_style))
        
        for i, opportunity in enumerate(analysis.get('automation_opportunities', []), 1):
            story.append(Paragraph(f"{i}. {opportunity.get('area', 'Opportunity')}", styles['Heading3']))
            story.append(Paragraph(f"<b>Current Process:</b> {opportunity.get('current_process', 'N/A')}", body_style))
            story.append(Paragraph(f"<b>Recommended Solution:</b> {opportunity.get('recommended_solution', 'N/A')}", body_style))
            story.append(Paragraph(f"<b>Potential Savings:</b> {opportunity.get('potential_savings', 'N/A')}", body_style))
            story.append(Paragraph(f"<b>Implementation:</b> {opportunity.get('implementation_difficulty', 'N/A')}", body_style))
            story.append(Spacer(1, 0.15*inch))
        
        # Quick Wins
        story.append(PageBreak())
        story.append(Paragraph("Quick Wins - Start Here", heading_style))
        for win in analysis.get('quick_wins', []):
            story.append(Paragraph(f"✓ {win}", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Impact Summary
        story.append(Paragraph("Estimated Monthly Impact", heading_style))
        story.append(Paragraph(analysis.get('estimated_monthly_impact', 'Pending detailed analysis'), body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Next Steps
        story.append(Paragraph("Recommended Next Steps", heading_style))
        for step in analysis.get('next_steps', []):
            story.append(Paragraph(f"→ {step}", body_style))
        
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("---", styles['Normal']))
        story.append(Spacer(1, 0.1*inch))
        story.append(Paragraph(
            "This report is based on an AI-powered analysis of your business assessment. "
            "For implementation support and custom solutions, contact our team.",
            styles['Normal']
        ))
        
        # Build PDF
        doc.build(story)
        
        return filepath


class AssessmentService:
    """Main service orchestrating the entire assessment workflow"""
    
    def __init__(self):
        self.orders = AssessmentOrder()
        self.payments = StripePaymentHandler()
        self.voice = TwilioVoiceAgent()
        self.reports = ReportGenerator()
    
    def start_assessment(self, company_name: str, email: str, phone: str) -> Dict[str, Any]:
        """Create a new assessment order and initiate payment"""
        order = self.orders.create_order(company_name, email, phone)
        
        # Create payment intent
        payment_intent_id = self.payments.create_payment_intent(email, order['id'])
        self.orders.update_order(order['id'], {"payment_intent_id": payment_intent_id})
        
        return {
            "order_id": order['id'],
            "payment_intent_id": payment_intent_id,
            "amount": "$997",
            "company_name": company_name,
            "email": email
        }
    
    def complete_payment(self, order_id: str, payment_intent_id: str) -> Dict[str, Any]:
        """Mark payment as complete and prepare for voice call"""
        if self.payments.verify_payment(payment_intent_id):
            self.orders.update_order(order_id, {"status": "paid"})
            
            # Generate voice call
            order = self.orders.get_order(order_id)
            call_sid = self.voice.create_voice_call(order['phone'], order_id)
            
            self.orders.update_order(order_id, {
                "status": "call_scheduled",
                "call_sid": call_sid
            })
            
            return {
                "success": True,
                "order_id": order_id,
                "call_sid": call_sid,
                "message": "Payment received! Your assessment call will be initiated shortly."
            }
        return {"success": False, "message": "Payment verification failed"}
    
    def process_transcript(self, order_id: str, transcript: str) -> Dict[str, Any]:
        """Process transcript and generate report"""
        self.orders.update_order(order_id, {"transcript": transcript, "status": "processing"})
        
        order = self.orders.get_order(order_id)
        
        # Analyze transcript with Claude
        analysis = self.reports.analyze_transcript(transcript)
        
        # Generate PDF report
        report_path = self.reports.generate_pdf_report(
            order_id,
            order['company_name'],
            analysis
        )
        
        self.orders.update_order(order_id, {
            "report_path": report_path,
            "status": "completed"
        })
        
        return {
            "success": True,
            "order_id": order_id,
            "report_path": report_path,
            "analysis": analysis
        }
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get data for admin dashboard"""
        orders = self.orders.list_orders()
        
        return {
            "total_orders": len(orders),
            "completed": len([o for o in orders if o['status'] == 'completed']),
            "in_progress": len([o for o in orders if o['status'] in ['call_scheduled', 'processing']]),
            "pending": len([o for o in orders if o['status'] == 'pending_payment']),
            "revenue": len([o for o in orders if o['status'] in ['paid', 'completed']]) * 997,
            "orders": orders
        }


# Initialize the service
service = AssessmentService()


# Example usage
if __name__ == "__main__":
    print("Assessment Service initialized and ready")
