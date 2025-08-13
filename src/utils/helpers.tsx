export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // This will format as "YYYY-MM-DDTHH:mm"
  };