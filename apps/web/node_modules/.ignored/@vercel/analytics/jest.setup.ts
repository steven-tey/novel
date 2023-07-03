import '@testing-library/jest-dom';

// Adds helpers like `.toHaveAttribute`
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
  // reset dom before each test
  document.getElementsByTagName('html')[0].innerHTML = '';
});
