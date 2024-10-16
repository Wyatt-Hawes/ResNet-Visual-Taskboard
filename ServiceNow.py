# Sending a Request
import os
from dotenv import load_dotenv
load_dotenv()



username = os.getenv('USER_NAME')
password = os.getenv('PASSWORD')

url = 'https://ucsc.service-now.com/api/now/table/incident?'

all_tickets = ('sysparm_query=assignment_group=55e7ddcd0a0a3d280047abc06e'
                   'd844c8^incident_state=1^ORincident_state=2^ORincident_sta'
                   'te=3^ORincident_state=4^ORincident_state=5^incident_state'
                   '=6^ORincident_state!=7')

#client_updated = ('sysparm_query=assignment_group=55e7ddcd0a0'
#                              'a3d280047abc06ed844c8^incident_state=1^ORi'
#                              'ncident_state=2^ORincident_state=3^ORincid'
#                              'ent_state=4^ORincident_state=5^incident_st'
#                              'ate!=6^ORincident_state!=7^sys_updated_byS'
#                              'AMEAScaller_id.user_name')

client_updated = ('sysparm_query=assignment_group=55e7ddcd0a0a3d280047abc06ed844c8^active=true^incident_stateNOT+IN6,7^sys_updated_bySAMEAScaller_id.user_name^ORassigned_toISEMPTY')

# Stale number of days, scroll to the right for 'gs.daysAgo(2)'
stale = ('sysparm_query=assignment_group=55e7ddcd0a0a3d280047abc06ed844c8^incident_state=1^ORincident_state=2^ORincident_state=4^ORincident_state=5^ORincident_state=3^incident_state!=6^ORincident_state!=7^sys_updated_on<javascript:gs.daysAgo(2)^caller_id!=67c139b309641440fa07e749fee81bd7^caller_id!=c5c2b5f309641440fa07e749fee81b40')

# Setting up Headers
headers = {'Content-Type':'application/json','Accept':'application/json'}

# Sending actual Request
import requests
request_url = url  + all_tickets
tickets = None
response = requests.get(request_url, auth=(str.format(username), str.format(password)), headers=headers)
response2 = requests.get(url + client_updated, auth=(str.format(username), str.format(password)), headers=headers)
response3 = requests.get(url + stale, auth=(str.format(username), str.format(password)), headers=headers)

print("Done")

if response.status_code != 200:
    raise ConnectionError('Error getting tickets all, recieved status code: {}'.format(response.status_code))
else:
# API DATA is stored in tickets
    ticket = response.json()

if response2.status_code != 200:
    raise ConnectionError('Error getting tickets client_updated, recieved status code: {}'.format(response2.status_code))
else:
# API DATA is stored in tickets
    ticket2 = response2.json()

if response3.status_code != 200:
    raise ConnectionError('Error getting tickets client_updated, recieved status code: {}'.format(response3.status_code))
else:
# API DATA is stored in tickets
    ticket3 = response3.json()

# ticket.keys()
# ticket['result'][0].keys()

import json

with open('../tickets.json', 'w') as file:
  # If JSON becomes too big because of too many tickets, use the code below to extract all the fields you need.
  #result = [{'description': item['description'], 'number': item['number'], 'short_description': item['short_description']} for item in ticket['result']]
  #ticket['result'] = result
  
  json.dump(ticket, file)
  
with open('../client_updated.json', 'w') as file:
  json.dump(ticket2, file)

with open('../stale.json', 'w') as file:
  json.dump(ticket3, file)
