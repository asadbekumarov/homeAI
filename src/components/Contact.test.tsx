import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "./Contact";
import { ProjectProvider } from "@/context/ProjectContext";

describe("Contact Component", () => {
  it("renders contact form fields and project contact information", () => {
    render(
      <ProjectProvider>
        <Contact />
      </ProjectProvider>
    );

    expect(screen.getByText("Aloqa")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("To'liq ismingiz")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+998 (90) 123-45-67")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("sizning@email.uz")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Qiziqtirgan savol yoki taklifingiz...")).toBeInTheDocument();
  });

  it("validates form inputs and shows error messages when submitted empty", async () => {
    const user = userEvent.setup();
    render(
      <ProjectProvider>
        <Contact />
      </ProjectProvider>
    );

    const submitBtn = screen.getByRole("button", { name: /Yuborish/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Ism kamida 2 ta belgidan iborat bo'lishi kerak")
      ).toBeInTheDocument();
    });
  });

  it("formats Uzbek phone number input automatically and submits successfully", async () => {
    const user = userEvent.setup();
    render(
      <ProjectProvider>
        <Contact />
      </ProjectProvider>
    );

    const nameInput = screen.getByPlaceholderText("To'liq ismingiz");
    const phoneInput = screen.getByPlaceholderText("+998 (90) 123-45-67");
    const emailInput = screen.getByPlaceholderText("sizning@email.uz");
    const messageInput = screen.getByPlaceholderText("Qiziqtirgan savol yoki taklifingiz...");
    const submitBtn = screen.getByRole("button", { name: /Yuborish/i });

    await user.type(nameInput, "Ali Valiev");
    await user.type(phoneInput, "901234567");
    expect(phoneInput).toHaveValue("+998 (90) 123-45-67");

    await user.type(emailInput, "ali@example.com");
    await user.type(messageInput, "Assalomu alaykum, kvartira narxlari haqida ma'lumot bering.");

    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Yuborildi!/i)).toBeInTheDocument();
    });
  });
});
