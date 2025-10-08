import json
import os
import requests
from typing import Dict, Any
from pydantic import BaseModel, Field

class LoanApplication(BaseModel):
    firstName: str = Field(..., min_length=1)
    lastName: str = Field(..., min_length=1)
    middleName: str = ""
    phone: str = Field(..., min_length=10)
    loanAmount: int = Field(..., gt=0)
    loanTerm: int = Field(..., gt=0)
    documentPhoto: str = ""

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send loan application to Bitrix24 CRM via webhook
    Args: event with httpMethod, body containing loan application data
          context with request_id
    Returns: HTTP response with created lead ID or error
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    webhook_url = os.environ.get('BITRIX24_WEBHOOK_URL')
    if not webhook_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Bitrix24 webhook URL not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    app_data = LoanApplication(**body_data)
    
    full_name = f"{app_data.lastName} {app_data.firstName} {app_data.middleName}".strip()
    
    lead_data = {
        'fields': {
            'TITLE': f'Заявка на займ {app_data.loanAmount} руб',
            'NAME': app_data.firstName,
            'LAST_NAME': app_data.lastName,
            'SECOND_NAME': app_data.middleName,
            'PHONE': [{'VALUE': app_data.phone, 'VALUE_TYPE': 'WORK'}],
            'OPPORTUNITY': app_data.loanAmount,
            'CURRENCY_ID': 'RUB',
            'COMMENTS': f'Сумма займа: {app_data.loanAmount} руб\nСрок: {app_data.loanTerm} дней\nФИО: {full_name}\nТелефон: {app_data.phone}',
            'SOURCE_ID': 'WEB',
            'STATUS_ID': 'NEW'
        }
    }
    
    try:
        response = requests.post(
            f"{webhook_url}crm.lead.add.json",
            json=lead_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('result'):
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'leadId': result['result'],
                        'message': 'Lead created successfully'
                    })
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': result.get('error_description', 'Unknown error')
                    })
                }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': f'Bitrix24 API error: {response.status_code}'
                })
            }
    
    except requests.exceptions.Timeout:
        return {
            'statusCode': 504,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': 'Request timeout'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
