**AUTHOR:** Julian Xhokaxhiu<br>
**VERSION:** 0.1<br>
**DESCRIPTION:** A smart proxy switcher which allows you to watch any Youtube video without restrictions<br>

**HOW IT WORKS:**<br>
Just continue surfing on Youtube as usual. When you will cross any blocked content for your region,
the extension will automatically reload the page by setting a free list of proxies got from http://spys.ru/en/https-ssl-proxy/.<br>
It will try them one by one until it finds one that works. When it will, the page will be loaded and the "proxy rule" will be cleared.<br>
So you can continue surfing without any "proxy worries". Anyway, the proxy is matched via Url, which means it will work only on the Url that will call the extension. If you change it even by changing a letter, the extension will start again from scratch.

**PROXY LIST:**<br>
Actually I'm parsing manually that website so I give no guarantee that this will work forever.<br>
However, to avoid mass loading on that server, the list will be cached for 3 hours. Then the list will be refreshed automatically.<br>
Actually there's no method to force reload this list. But probably I'll add it as a button in the option page.

**WHY ANOTHER PROXY EXTENSION:**<br>
Because I was pissed of various proxy methods used that:
- will enforce you to use only one Server, which means that after some time it will be slow as hell;
- will ask you to pay/donate to get "high speed";
- will not allow you to rotate a list of your choice;

So I decided to create my own which probably will be enhanced in the future, who knows.

**LICENSE:**<br>
See [LICENSE](https://github.com/julianxhokaxhiu/chrome-jailbreak-youtube/blob/master/LICENSE)

Enjoy!
