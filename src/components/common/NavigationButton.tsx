import { useNavigate } from 'react-router-dom';

interface DetailButtonProps {
  text?: string;
  onClick?: () => void;
}

export const NavigationButton = ({ text = '戻る', onClick }: DetailButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick ? onClick() : navigate(-1);
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
      aria-label={`${text}ボタン`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      {text}
    </button>
  )
}
