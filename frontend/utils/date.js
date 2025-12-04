import moment from "moment";

export const formatDate = (dateString) => {
  if (!dateString) return "";
  return moment(dateString).format("MMM D, YYYY");
};

export const formatTime = (dateString) => {
  if (!dateString) return "";
  return moment(dateString).format("hh:mm A");
};


