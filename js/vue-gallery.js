// Flickr API key
const API_KEY = '2133007599ab5e9ef4fe21dc6cfe5700';
/**
 * ※参考：コードのひな形
 * ここまで学習した内容を基に、Vueのコードを書くときの「ひな形」を用意しました。課題に取り組む際の参考にしてください。
 */
// 検索テキストに応じたデータを取得するためのURLを作成して返す
const getRequestURL = (searchText) => {
	const parameters = $.param({
		method: 'flickr.photos.search',
		api_key: API_KEY,
		text: searchText, // 検索テキスト
		sort: 'interestingness-desc', // 興味深さ順
		per_page: 4, // 取得件数
		license: '4', // Creative Commons Attributionのみ
		extras: 'owner_name,license', // 追加で取得する情報
		format: 'json', // レスポンスをJSON形式に
		nojsoncallback: 1, // レスポンスの先頭に関数呼び出しを含めない
	});
	const url = `https://api.flickr.com/services/rest/?${parameters}`;
	return url;
};
// photoオブジェクトから画像のURLを作成して返す
const getFlickrImageURL = (photo, size) => {
	let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
    photo.secret
  }`;
	if (size) {
		// サイズ指定ありの場合
		url += `_${size}`;
	}
	url += '.jpg';
	return url;
};
// photoオブジェクトからページのURLを作成して返す
const getFlickrPageURL = photo => `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
// photoオブジェクトからaltテキストを生成して返す
const getFlickrText = (photo) => {
	let text = `"${photo.title}" by ${photo.ownername}`;
	if (photo.license === '4') {
		// Creative Commons Attribution（CC BY）ライセンス
		text += ' / CC BY';
	}
	return text;
};

Vue.directive('tooltip', {
  bind(el, binding) {
    $(el).tooltip({
      title: binding.value,
      placement: 'bottom',
    });
  },
  unbind(el) {
    $(el).tooltip('dispose');
  },
});

new Vue({
	el: '#gallery', // elオプションの値に '#gallery' を設定
	// ローカル登録するコンポーネントを設定
	// ( コンポーネントを利用しない場合は components: {}, は削除すること )
	data: {
		// 利用するデータを設定
		cats: [],
		dogs: [],
	},
	created() {
		this.fetchImagesFromFlickr('dog');
		this.fetchImagesFromFlickr('cat');
	},
	//Vueが読み込まれたときに実行する処理を定義
	methods: {
		fetchImagesFromFlickr(searchText) {
			const url = getRequestURL(searchText);
			$.getJSON(url, (data) => {
				if (data.stat !== 'ok') {
					return;
				}
				const fetchedPhotos = data.photos.page;
				if (fetchedPhotos.length === 0) {
					return;
				}
				this[searchText + 's'] = data.photos.photo.map(photo => ({
					id: photo.id,
					imageURL: getFlickrImageURL(photo, 'q'),
					pageURL: getFlickrPageURL(photo),
					text: getFlickrText(photo),
				}));
			}, this);
		}
	}
});
