import ArticleList from './ArticleList'
import Fixtures from './Fixtures'
import History from './History'

const HomePage = () => {
  return (
    <>
      <section aria-label="記事一覧">
        <ArticleList />
      </section>
      <section aria-label="試合日程">
        <Fixtures />
      </section>
      <section aria-label="クラブの歴史">
        <History />
      </section>
    </>
  )
}

export default HomePage