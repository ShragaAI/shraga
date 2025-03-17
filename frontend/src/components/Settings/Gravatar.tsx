import { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";

interface GravatarProps {
  email: string;
  className?: string;
  onLoaded?: () => void;
  onError?: () => void;
}

export default function Gravatar({
  email,
  className,
  onLoaded = () => {},
  onError = () => {},
}: GravatarProps) {
  const [gravatarUrl, setGravatarUrl] = useState<string | false>(false);

  const getGravatarURL = async (email: string) => {
    const address = email.trim().toLowerCase();
    const hash = sha256(address).toString();
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;

    try {
      const response = await fetch(gravatarUrl);
      if (response.ok) {
        return gravatarUrl;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchGravatar = async () => {
      const url = await getGravatarURL(email);

      if (url) {
        setGravatarUrl(url);
        onLoaded();
      } else {
        onError();
      }
    };

    if (email) {
      fetchGravatar();
    }
  }, [email]);

  if (!gravatarUrl) {
    return null;
  }

  return (
    <div className="p-2">
      <img src={gravatarUrl} className={`w-6 h-6 rounded-full ${className}`} />
    </div>
  );
}
