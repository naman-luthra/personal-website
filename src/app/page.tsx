import Portfolio from "@/components/portfolio/Portfolio";

import { LocaleProvider } from "@/components/portfolio/Locale";

export default function Home() {
  return (
    <LocaleProvider>
      <Portfolio />
    </LocaleProvider>
  );
}
