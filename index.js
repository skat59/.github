//https://rutube.ru/api/video/person/24674834/?style=feed
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const feed = 'https://rutube.ru/api/video/person/24674834/?style=feed';
var items = [], output = ``;

const fetchRuTube = async function (url) {
	return new Promise(function(resolve, reject) {
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
			//if(has_next){
			//	let itm = await fetchRuTube(next);
			//}else{
				let clone = JSON.parse(JSON.stringify(items));
				
				output = ``;
				clone.forEach((elt) => {
					output += `<a href="${elt.url}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${elt.thubnail}?width=250">
    <img src="${elt.thubnail}?width=250" alt="${elt.title}" title="${elt.title}">
  </picture>
</a>`;
				});
				output += ``;
				const md = path.join(__dirname, 'profile', 'README.md');
				const str = fs.readFileSync(md, { encoding: 'utf8', flag: 'r' });
				const regex = /(\<!-- BEGIN RUTUBE -->(?:\s+)?)(.+)?(\<!-- END RUTUBE -->)/gmis;
				const subst = `$1${output}\n$3`;
				const result = str.replace(regex, subst);
				fs.writeFileSync(md, result, { encoding: 'utf8' });
				resolve(clone);
			//}
		}).catch((react) => {
			console.log(react);
			reject(react);
		});
	});
};

fetchRuTube(feed).then(function(ars){
	return ars.length;
	/**
	let output = `<table>
	<tbody>
		`;
	ars.forEach((el) => {
		output += `<tr>
			<td><a href="${el.url}" target="_blank"><img src="${el.thubnail}" alt="${el.title}"></a></td>
			<td>
				<h3>${el.title}</h3>
				${el.description && `<p>${el.description}</p>`}
				<p style="text-align: right;"><a href="${el.url}" target="_blank">View</a></p>
			</td>
		</tr>
		`;
	});
	output = output.trimEnd();
	output += `
	</tbody>
</table>`;
	//console.log(output);
	**/
}).then((i) => {
	console.log(arguments);
}).catch((e) => {
	console.log(e);
});
