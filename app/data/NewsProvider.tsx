import { useState, useEffect, createContext } from "react";
import Constants from "expo-constants";
import axios from "axios";


type Article = {
  id: string;
  title: string;
  section: string;
  date: string;
  url: string;
  image?: string;
}

type NewsContextTypes = {
  tag: string;
  setTag: (tag: string) => void;
  country: string;
  setCountry: (country: string) => void;
  loading: boolean;
  news: Article[];
};

const NewsContext = createContext<NewsContextTypes | undefined>(undefined);

interface NewsProviderProps {
  children: React.ReactNode;
};

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const [news, setNews] = useState<Article[]>([]);
  const [tag, setTag] = useState("");
  const [country, setCountry] = useState("world");
  const [loading, setLoading] = useState(true);
 const yesterday = new Date();
 yesterday.setDate(yesterday.getDate() - 2);
 const formattedDate = yesterday.toISOString().split("T")[0];
  const expoConfig = Constants.expoConfig;
  const { GUARDIAN_API_KEY } = expoConfig?.extra as {
    GUARDIAN_API_KEY: string;
  };

  
  useEffect(() => {
    const fetchData = async () => {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      try {
        const res = await axios.get(
          `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&section=${country}&q=${tag}&show-fields=thumbnail&order-by=newest&page=${randomPage}&page-size=11`
        );
        
        const data = res.data.response.results.map(article => ({
            id: article.id,
            title: article.webTitle,
            section: article.sectionName,
            date: article.webPublicationDate,
            url: article.webUrl,
            image: article.fields?.thumbnail
        }));
        setNews(data);
        console.log("tag: ", tag);
        console.log(data);
        setLoading(false)
      } catch (error) {
        console.error("There has been an error", error);
      }
    };

    fetchData();
  }, [tag]);

  return <NewsContext.Provider value={{news, tag ,loading, country ,setTag, setCountry,}}>{children}</NewsContext.Provider>;
};

export default NewsContext;
