import { ReactNode, Children, isValidElement } from 'react';

interface SwitchShowProps {
  children: ReactNode;
}

interface CaseProps {
  when: boolean;
  children: ReactNode;
}

interface DefaultProps {
  children?: ReactNode;
}

export default function SwitchShow ({ children }: SwitchShowProps): ReactNode {
  let matched: ReactNode = null;
  let fallback: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const { when } = child.props as CaseProps;

    if (when) {
      matched = child;
    } else if (!matched && when === undefined) {
      fallback = child;
    }
  });

  return matched ?? fallback;
};

const Case = ({ when, children }: CaseProps): ReactNode => when ? children : null;
const Default = ({ children }: DefaultProps): ReactNode => children;

SwitchShow.Case = Case;
SwitchShow.Default = Default;