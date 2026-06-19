import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const formatDate = (dateString) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: id,
    });
  } catch {
    return dateString;
  }
};

export default formatDate;
