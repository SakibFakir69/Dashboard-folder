
  export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: '95%',
    minWidth: '300px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
    zIndex: 1001,  // <- Add this
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,  // <- Add this
  },
};




  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f3f4f6", 
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      borderRadius: 4,
      minHeight: "48px",
      boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#3b82f6" : "#f3f4f6",
      color: state.isFocused ? "#fff" : "#111827",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#111827",
    }),
  };

