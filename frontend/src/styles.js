export const styles = {
  CalendarApp: {
    statusBar: {
      alignContent: "center",
      alignItems: "center",
      background: "rgba(0,42,245,0.8)",
      border: "2px solid #4169e1",
      borderRadius: "8px",
      display: "flex",
      height: "60px",
      margin: "6em auto 0",
      padding: "8px 16px",
      width: "80vw",
    },
    statusBarText: {
      padding: "1em",
      margin: 0,
      fontWeight: "bold",
      color: "white",
    },
    contentContainer: {
      display: "flex",
      maxWidth: "80vw",
      margin: "40px auto",
    },
  },
  Agenda: {
    container: {
      display: "flex",
      flexDirection: "column",
      width: "70%",
      marginRight: "40px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    eventsContainer: {
      maxHeight: "60vh",
      overflowY: "scroll",
      border: "4px solid rgb(65, 105, 225)",
      borderRadius: "16px",
      padding: "12px",
    },
    event: {
      display: "flex",
      flexDirection: "column",
      borderRadius: 8,
      boxShadow: "0px 4px 8px rgb(115 115 115 / 60%)",
      padding: "16px",
      marginBottom: "16px",
      lineHeight: 1.2,
      whiteSpace: "pre",
    },
    eventDate: {
      display: "flex",
      maxWidth: "50%",
      justifyContent: "space-between",
    },
    eventTitle: { margin: "0 0 16px" },
    eventContent: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "flex",
      flexDirection: "column",
      WebkitLineClamp: 3,
      maxHeight: 120,
      color: "#737373",
    },
  },
  CalendarEventDate: {
    text: { margin: "0 0 24px", fontSize: "0.9em", marginRight: 16 },
  },
  CreateEventForm: {
    container: {
      display: "flex",
      flexDirection: "column",
      width: "30%",
    },
    header: { marginBottom: "16px" },
    form: { display: "flex", flexDirection: "column" },
    label: { fontWeight: "bold", marginBottom: "8px" },
    input: {
      marginBottom: "16px",
    },
    button: {
      border: "none",
      outline: "none",
      borderRadius: "4px",
      background: "#4169e1",
      color: "#fff",
      padding: "16px",
      marginBottom: "0.6em",
    },
  },
};
