import axios from "axios";

const sendEmail = async () => {
  try {
    // const response = await axios.post("http://localhost:8080/api/email/send", {
    const response = await axios.post("https://certificate-request-portal-system-e01i.onrender.com/api/email/send", {
      to: "receiver_email@example.com",
      subject: "Welcome to our App",
      body: "Thanks for signing up!",
    },{ withCredentials: true });
    alert(response.data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export default sendEmail;