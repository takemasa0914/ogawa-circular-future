from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote

root=Path(__file__).parent/'dist'
class Page(HTMLParser):
    def __init__(self,path):
        super().__init__();self.path=path;self.ids=set();self.refs=[];self.controls=[];self.headings=0
        self.feed(path.read_text(encoding='utf-8'))
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, (self.path.name,'duplicate id',a['id'])
            self.ids.add(a['id'])
        if tag=='h1':self.headings+=1
        for key in ['href','src']:
            if key in a:self.refs.append(a[key])
        if tag=='img':assert a.get('alt'),(self.path,'missing alt')
        for key in ['aria-controls','aria-labelledby']:
            if key in a:self.controls+=a[key].split()
pages={p.name:Page(p) for p in root.glob('*.html')}
count=0
for name,p in pages.items():
    assert p.headings==1,(name,'h1 count',p.headings)
    for control in p.controls:assert control in p.ids,(name,'invalid aria target',control)
    for ref in p.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc:continue
        target=(root/unquote(u.path)) if u.path else p.path
        assert target.is_file(),(name,'missing file',ref)
        if u.fragment:assert u.fragment in pages[target.name].ids,(name,'missing anchor',ref)
        count+=1
assert all('noindex,nofollow' in p.path.read_text(encoding='utf-8') for p in pages.values())
print(f'PASS: {len(pages)} pages; {count} local asset/link references; headings, anchors, image alt text, ARIA targets and concept search settings.')
