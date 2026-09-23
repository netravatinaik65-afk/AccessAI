import { useEffect } from 'react';

/**
 * Custom hook to update document title for screen readers and browser tabs.
 * Supports WCAG 2.4.2 (Page Titled).
 * 
 * @param {string} title - The title of the page
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = `${title} | AccessAI`;
    }
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

export default useDocumentTitle;
