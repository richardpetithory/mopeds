import {useEffect, useState} from "react";

export const StatusPage = () => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/status/")
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
      })
      .catch(() => setStatus("failure"));
  });

  return (<div>{status}</div>);
};
