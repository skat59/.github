//https://rutube.ru/api/video/person/24674834/?style=feed
(async function(){
	const fetch = require('node-fetch');
	const fs = require('fs');
	const path = require('path');
	const feed = 'https://rutube.ru/api/video/person/24674834/?style=feed';
	let output = ``;

	const fetchRuTube = async function (url) {
		return new Promise(function(resolve, reject) {
			let items = [];
			fetch(url).then(function(res) {
				return res.text();
			}).then(async function(body) {
				let json = JSON.parse(body);
				let has_next = json.has_next;
				let next = json.next;
				let results = json.results;
				results.forEach((el) => {
					let ob = {
						url: el.video_url,
						title: el.title,
						description: el.description,
						thubnail: el.thumbnail_url
					};
					items.push(ob);
				});
					let clone = items.slice(0, 11);
					resolve(clone);
				//}
			}).catch((e) => {
				resolve([]);
			});
		});
	};

	let log = await fetchRuTube(feed);
	log.forEach((elt) => {
		output += `

<a href="${elt.url}">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset="${elt.thubnail}?width=250">
		<img src="${elt.thubnail}?width=250" alt="${elt.title}" title="${elt.title}">
	</picture>
	<p><strong>${elt.title}</strong></p>
</a>

`;
	});
	const md = path.join(__dirname, 'profile', 'README.md');
	const str = fs.readFileSync(md, { encoding: 'utf8', flag: 'r' });
	const regex = /(\<!-- BEGIN RUTUBE -->(?:\s+)?)(.+)?(\<!-- END RUTUBE -->)/gmis;
	const subst = `$1${output}\n$3`;
	const result = str.replace(regex, subst);
	fs.writeFileSync(md, result, { encoding: 'utf8' });
})();

