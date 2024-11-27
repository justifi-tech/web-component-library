
export const MapTerminalStatusToBadge = (status: string) => {
  switch (status) {
    case 'connected':
      return "<span class='badge bg-success' title='This terminal is connected.'>Connected</span>";
    case 'disconnected':
      return "<span class='badge bg-danger' title='This terminal is disconnected.'>Disconnected</span>";
    case 'unknown':
      return "<span class='badge bg-secondary' title='The status of this terminal is unknown'>Unknown</span>";
  };
};
