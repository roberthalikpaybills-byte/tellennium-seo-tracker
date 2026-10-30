"""Check tracker.json so the top panels and the table agree. Run before pushing: python3 scripts/check_consistency.py"""
import json,sys
d=json.load(open('tracker.json'));bad=[]
for i in d['items']:
    s=i.get('status','');l=i.get('light')
    if s=='Completed' and l!='green': bad.append(f"#{i['id']}: Completed but light {l}")
    if s=='Verify complete' and l!='vgreen': bad.append(f"#{i['id']}: Verify complete but light {l}")
    if s not in('Completed','Verify complete') and l in('green','vgreen'): bad.append(f"#{i['id']}: status {s} but light {l}")
    if s=='Completed' and any(v not in('done','na') for v in (i.get('parties') or {}).values()): bad.append(f"#{i['id']}: Completed but a party is not done")
    if 'reported Done' in (i.get('updateText') or '') and s!='Completed' and 'remaining gap' not in (i.get('updateText') or '').lower() and s!='Verify complete': bad.append(f"#{i['id']}: says reported Done but is {s} with no remaining gap stated")
ids={str(i['id']) for i in d['items']}
for w in d['seoPipeline']['weeks']+[{'items':d['seoPipeline']['bench']}]:
    for a in w['items']:
        if str(a['id']) not in ids: bad.append(f"pipeline item #{a['id']} not in items")
print('\n'.join(bad) or 'OK: status, lights and pipeline agree');sys.exit(1 if bad else 0)
