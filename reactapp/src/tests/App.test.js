import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Apply from "../pages/Apply";
import Admin from "../pages/Admin";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CertificateList from "../components/CertificateList";

// ✅ Test 1: Home page renders correctly
test("renders home page title and description", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  expect(screen.getByText("Welcome to the Online Certificate Portal")).toBeInTheDocument();
  expect(screen.getByText("Request and receive your course certificates online!")).toBeInTheDocument();
});

// ✅ Test 2: Request button links to /apply
test("renders 'Request Certificate' button with link", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  const requestButton = screen.getByText("Request Certificate");
  expect(requestButton).toBeInTheDocument();
  expect(requestButton.closest("a")).toHaveAttribute("href", "/apply");
});

// ✅ Test 3: Navbar shows correct links and title
test("renders navbar with title and links", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  expect(screen.getByText("Certificate Portal")).toBeInTheDocument();
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Request Certificate")).toBeInTheDocument();
  expect(screen.getByText("Admin Panel")).toBeInTheDocument();
});

// ✅ Test 4: Navbar links have correct hrefs
test("navbar links route correctly", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
  expect(screen.getByText("Request Certificate").closest("a")).toHaveAttribute("href", "/apply");
  expect(screen.getByText("Admin Panel").closest("a")).toHaveAttribute("href", "/admin");
});

// ✅ Test 5: Footer displays correct copyright
test("renders footer with correct text", () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
  expect(screen.getByText(/© 2023 Online Certificate Portal. All rights reserved./i)).toBeInTheDocument();
});

// ✅ Test 6: Apply form renders with all fields and submit button
test("renders apply form input fields", () => {
  render(
    <MemoryRouter>
      <Apply />
    </MemoryRouter>
  );
  expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Course")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});

// ✅ Test 7: Certificate list renders properly with props
test("renders certificate list with table and props", () => {
  const sampleData = [
    {
      id: 1,
      name: "Alice",
      course: "React",
      email: "alice@example.com",
      completionDate: "2025-07-11",
      status: "PENDING",
    },
  ];

  const mockApprove = jest.fn();

  render(
    <MemoryRouter>
      <CertificateList requests={sampleData} onApprove={mockApprove} />
    </MemoryRouter>
  );

  expect(screen.getByText("Certificate Requests")).toBeInTheDocument();
  expect(screen.getByText("Alice")).toBeInTheDocument();
  expect(screen.getByText("React")).toBeInTheDocument();
  expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  expect(screen.getByText("PENDING")).toBeInTheDocument();
  expect(screen.getByText("Approve")).toBeInTheDocument();
});

// ✅ Test 8: Admin page renders CertificateList
test("renders AdminDashboard from Admin page", () => {
  render(
    <MemoryRouter>
      <Admin />
    </MemoryRouter>
  );
  // Since fetch is not mocked, there might not be content immediately, so test structure
  expect(screen.getByText("Certificate Requests")).toBeInTheDocument();
});
