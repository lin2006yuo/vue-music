import { getLyric } from "api/song";
import { ERR_OK } from "api/config";
import { Base64 } from "js-base64";

export default class song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    (this.id = id),
      (this.mid = mid),
      (this.singer = singer),
      (this.name = name),
      (this.ablum = album),
      (this.duration = duration),
      (this.image = image),
      (this.url = url);
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject(new Error("no lyric"));
        }
      });
    });
  }
}

export function createSong(musicData) {
  return new song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname || "kong",
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`,

    //     000GDzSZ0yAEB9
    // C1L0001ApDs72gYqUk
    // url: `http://ws.stream.qqmusic.qq.com/C100${
    //   musicData.songmid
    // }.m4a?fromtag=0&guid=126548448`
    // https://api.bzqll.com/music/tencent/url?id=000r4u0l0rkEst&key=579621905
    url: `https://api.bzqll.com/music/tencent/url?id=${
      musicData.songmid
    }&key=579621905`
  });
}

export function filterSinger(singers) {
  let ret = [];
  if (!singers) {
    return "";
  }
  singers.forEach(singer => {
    ret.push(singer.name);
  });
  return ret.join("/");
}
