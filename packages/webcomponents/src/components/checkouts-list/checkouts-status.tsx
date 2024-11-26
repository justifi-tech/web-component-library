
export const MapCheckoutStatusToBadge = (status: string) => {
  switch (status) {
    case 'created':
      return "<span class='badge bg-primary' title='The checkout has been created'>Created</span>";
    case 'completed':
      return "<span class='badge bg-success' title='The checkout has been completed'>Completed</span>";
    case 'attempted':
      return "<span class='badge bg-secondary' title='The checkout has been attempted'>Attempted</span>";
    case 'expired':
      return "<span class='badge bg-danger' title='The checkout has expired'>Expired</span>";
  };
};
