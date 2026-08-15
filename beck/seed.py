import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Participant

def run():
    print('Seeding database with 125 participants...')
    roles = ['developer', 'designer', 'product', 'student']
    names = [
        'Alexander Smith', 'Maria Garcia', 'James Johnson', 'Wei Chen', 
        'Aisha Patel', 'Maxim Ivanov', 'Sophia Lee', 'Yusuf Ahmed',
        'Emma Wilson', 'Liam Brown', 'Olivia Davis', 'Noah Miller',
        'Ava Taylor', 'Elias Yilmaz', 'Isabella Moore', 'Mateo Martinez'
    ]
    
    participants = []
    for _ in range(125):
        role = random.choice(roles)
        name = random.choice(names) + ' ' + str(random.randint(1, 100))
        email = name.lower().replace(' ', '.') + f'.{random.randint(1, 1000)}@example.com'
        participants.append(Participant(name=name, email=email, role=role))
        
    Participant.objects.bulk_create(participants)
    print('Seed complete! Added 125 participants.')

if __name__ == '__main__':
    run()
