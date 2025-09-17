import { useNavigate } from 'react-router-dom';

export function NavigateToProducts({ children, filter }) {
  const navigate = useNavigate();
  const {age = [], type = [], subject = []} = filter;
  
  const handleNavigateToProducts = () => {
    // Stringify the filter arrays to be passed in the URL
    const params = new URLSearchParams();
    if (age?.length > 0) params.append('age', JSON.stringify(age));
    if (type?.length > 0) params.append('type', JSON.stringify(type));
    if (subject?.length > 0) params.append('subject', JSON.stringify(subject));
    
    // Navigate to the Products page with the filter query parameters
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div onClick={handleNavigateToProducts}>
      { children }
    </div>
  );
}
