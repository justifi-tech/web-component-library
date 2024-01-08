interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}
declare function Button({ children, ...other }: ButtonProps): JSX.Element;
declare namespace Button {
    var displayName: string;
}

export { Button, type ButtonProps };
