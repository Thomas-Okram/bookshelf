import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/SignUp";
import VerifyOtp from "./components/VerifyOTP";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import About from "./About";
import AddBook from "./components/AddBook";
import AdminRoute from "./components/AdminRoute"; // ✅ new
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";
import EditBook from "./components/EditBook";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/add-book"
        element={
          <AdminRoute>
            <AddBook />
          </AdminRoute>
        }
      />
      <Route path="/books" element={<BookList />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/books/:id/edit" element={<EditBook />} />
    </Routes>
  );
}

export default App;
