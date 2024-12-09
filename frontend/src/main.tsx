import { createRoot } from 'react-dom/client'; // Используем createRoot вместо render
import App from './App';
import GlobalStyles from './styles/GlobalStyles';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement); // Создаем корень
  root.render(
    <GlobalStyles>
      <App />
    </GlobalStyles>
  );
}
