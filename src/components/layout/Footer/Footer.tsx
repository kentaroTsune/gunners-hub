const Footer = () => {
  return (
    <footer className="bg-red-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} The Gunners Hub
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://www.arsenal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm"
            >
              公式サイト
            </a>
            <a
              href="https://www.premierleague.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm"
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

export default Footer
