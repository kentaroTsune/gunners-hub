import foundations from "../../assets/img/history/foundations.jpg";
import chapman_herbert from "../../assets/img/history/chapman_herbert.jpg";
import wenger from "../../assets/img/history/wenger.jpg";
import graham from "../../assets/img/history/graham.jpg";

export const History = () => {
  return (
    <div className="space-y-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800">
        クラブの歴史
      </h2>
      <ul className="grid grid-cols-1 lg:grid-cols-12 grid-rows-none lg:grid-rows-[repeat(3,400px)] gap-6">
        <li className="lg:col-span-12 row-span-1 relative overflow-hidden rounded-xl group">
          <div className="flex flex-col lg:flex-row h-full">
            <figure className="flex-1 relative overflow-hidden">
              <img
                src={foundations}
                alt="アーセナルの基盤"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </figure>
            <div className="lg:flex-1 bg-white p-6 lg:flex lg:flex-col lg:justify-center">
              <h3 className="text-lg lg:text-3xl font-bold mb-1 lg:mb-4">アーセナルの基盤</h3>
              <p className="text-l text-justify leading-relaxed">
                1886年後半、ウールウィッチ・アーセナル兵器工場の労働者たちの一団が、サッカーチームを結成することを決めた。彼らは、工場の入り口の上に設置された日時計にちなんで、チーム名を「ダイアル・スクエア」と名付けた。
              </p>
            </div>
          </div>
        </li>
        <li className="lg:col-span-6 row-span-1 relative overflow-hidden rounded-xl group">
          <div className="flex flex-col h-full">
            <figure className="flex-1 relative overflow-hidden">
              <img
                src={chapman_herbert}
                alt="ハーバート・チャップマン"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </figure>
            <div className="bg-white p-6">
              <h3 className="text-lg font-bold mb-1">ハーバート・チャップマン - 偉大な革新者</h3>
              <p className="text-justify leading-relaxed">1925年の夏、ヘンリー・ノリスがアーセナルに新しい監督が必要だと判断した際、彼は次の任命がもたらす影響を予想だにしなかった。</p>
            </div>
          </div>
        </li>
        <li className="lg:col-span-6 lg:row-span-2 order-last lg:order-none relative overflow-hidden rounded-xl group">
          <div className="flex flex-col h-full">
            <figure className="flex-1 relative overflow-hidden">
              <img
                src={wenger}
                alt="アーセン・ベンゲル"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </figure>
            <div className="bg-white p-6">
              <h3 className="text-lg lg:text-xl font-bold mb-2">アーセン・ベンゲルの時代</h3>
              <p className="text-justify leading-relaxed">
                ジョージ・グラハムの退任後、アーセナルはクラブの運命を永遠に変えることになる無名のフランス人監督に任されることになった。新監督はピッチ上のアーセナルを変革するだけでなく、最先端のトレーニングプログラムや食事システムを導入し、ピッチ外の選手たちの生活にも革命を起こした。
              </p>
            </div>
          </div>
        </li>
        <li className="lg:col-span-6 row-span-1 relative overflow-hidden rounded-xl group">
          <div className="flex flex-col h-full">
            <figure className="flex-1 relative overflow-hidden">
              <img
                src={graham}
                alt="グラハム"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </figure>
            <div className="bg-white p-6">
              <h3 className="text-lg lg:text-xl font-bold mb-2">グラハムの黄金時代</h3>
              <p className="text-justify leading-relaxed">
                1986年5月、ジョージ・グラハムがアーセナルの監督に就任しました。1年以内に、彼は1979年のFAカップ以来、クラブ初のタイトルをもたらしました。
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}