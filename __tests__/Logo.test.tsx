import React from "react";
import { render, screen } from "@testing-library/react";
import Logo from "../app/components/Logo";

describe("Logo Component", () => {
  it("renders logo component", () => {
    const { container } = render(<Logo />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders logo with text when showText is true", () => {
    render(<Logo showText />);
    expect(screen.getByText("Verba")).toBeInTheDocument();
  });

  it("renders without text when showText is false", () => {
    render(<Logo showText={false} />);
    expect(screen.queryByText("Verba")).not.toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container: small } = render(<Logo size="sm" />);
    const { container: large } = render(<Logo size="lg" />);
    
    expect(small.firstChild).toBeInTheDocument();
    expect(large.firstChild).toBeInTheDocument();
  });
});


