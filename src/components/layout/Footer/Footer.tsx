export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {currentYear} The Gunners Hub
            </p>
          </div>
          <div className="flex space-x-4" aria-label="外部リンク">
            <a
              href="https://www.arsenal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm"
              aria-label="Arsenal FC 公式サイトへ（新しいタブで開きます）"
            >
              公式サイト
            </a>
            <a
              href="https://www.premierleague.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm"
              aria-label="プレミアリーグ公式サイトへ（新しいタブで開きます）"
            >
              プレミアリーグ
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-red-200">
          <p>このサイトはファンによる非公式サイトです</p>
        </div>
      </div>
    </footer>
  );
};
