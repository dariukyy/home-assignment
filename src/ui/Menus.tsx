import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ButtonIcon = styled.button<{ id: boolean }>`
  position: relative;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  background-color: ${(props) => (props.id ? "#d1d5db" : "transparent")};

  &:hover {
    background-color: #d1d5db;
  }

  & svg {
    height: 2.1rem;
    width: 2.1rem;
    color: #6b7280;
    font-weight: 300;
  }
`;

const StyledList = styled.ul<{ position: Position }>`
  position: fixed;
  z-index: 999;
  background-color: #fff;
  box-shadow: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  border-radius: 7px;
  overflow: hidden;

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s ease 0s;
  display: flex;
  align-items: center;
  gap: 1.6rem;

  & span {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
  }
  &:hover {
    background-color: #d1d5db;
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: #6b7280;
    transition: all 0.3s;
  }
`;

type Position = {
  x: number;
  y: number;
};

type MenusContextProps = {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  position: { x: number; y: number } | null;
  setPosition: (position: Position) => void;
};
type MenusProps = {
  children: ReactNode;
};

type ToggleProps = {
  id: string;
};

type ButtonProps = {
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
};

const MenusContext = createContext<MenusContextProps | null>(null);

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  const close = () => setOpenId("");

  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{
        openId,
        close,
        open,
        position,
        setPosition,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }: ToggleProps) {
  const { open, openId, close, setPosition } = useContext(MenusContext)!;

  useEffect(() => {
    const handleScroll = () => {
      close();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [close]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const button = target.closest("button");

    if (!button) return;

    const rect = button.getBoundingClientRect();

    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    openId === "" || openId !== id ? open(id) : close();
  }
  const isClicked = openId === id;
  return (
    <ButtonIcon id={isClicked} onClick={handleClick}>
      {<HiOutlineDotsHorizontal />}
    </ButtonIcon>
  );
}
type ListProps = {
  id: string;
  children: ReactNode;
};

function List({ id, children }: ListProps) {
  const { openId, position, close } = useContext(MenusContext)!;
  const ref = useOutsideClick(close, false);

  if (openId !== id || position === null) return null;

  return createPortal(
    <StyledList onClick={close} ref={ref} position={position}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick }: ButtonProps) {
  // const { close } = useContext(MenusContext)!;

  function handleClick() {
    onClick?.();
    alert("Do something");
  }
  return (
    <StyledButton onClick={handleClick}>
      {icon}
      <span>{children}</span>
    </StyledButton>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;