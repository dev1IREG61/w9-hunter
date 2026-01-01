import React from "react";
import { FiHelpCircle } from "react-icons/fi";

interface EasyIconProps {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}

const EasyIcon: React.FC<EasyIconProps> = ({
  icon,
  size = 24,
  color,
  className = "",
}) => {
  const [IconComponent, setIconComponent] = React.useState<any>(null);

  React.useEffect(() => {
    const prefix = icon.substring(0, 2);
    let importPromise;

    switch (prefix) {
      case "Fi":
        importPromise = import("react-icons/fi");
        break;
      case "Fa":
        importPromise = import("react-icons/fa");
        break;
      case "Md":
        importPromise = import("react-icons/md");
        break;
      case "Hi":
        importPromise = import("react-icons/hi");
        break;
      case "Io":
        importPromise = import("react-icons/io5");
        break;
      case "Ai":
        importPromise = import("react-icons/ai");
        break;
      case "Bi":
        importPromise = import("react-icons/bi");
        break;
      case "Bs":
        importPromise = import("react-icons/bs");
        break;
      case "Cg":
        importPromise = import("react-icons/cg");
        break;
      case "Gi":
        importPromise = import("react-icons/gi");
        break;
      case "Gr":
        importPromise = import("react-icons/gr");
        break;
      case "Ri":
        importPromise = import("react-icons/ri");
        break;
      case "Si":
        importPromise = import("react-icons/si");
        break;
      case "Tb":
        importPromise = import("react-icons/tb");
        break;
      case "Ti":
        importPromise = import("react-icons/ti");
        break;
      default:
        importPromise = import("lucide-react");
    }

    importPromise
      .then((module) => {
        const Component = module[icon];
        if (Component) {
          setIconComponent(() => Component);
        }
      })
      .catch(() => setIconComponent(null));
  }, [icon]);

  if (!IconComponent) {
    return <FiHelpCircle size={size} color={color} className={className} />;
  }

  return <IconComponent size={size} color={color} className={className} />;
};

export default EasyIcon;
