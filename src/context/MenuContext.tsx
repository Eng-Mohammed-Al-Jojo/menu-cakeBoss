import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { MenuService, type MenuData } from "../services/menuService";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

interface MenuContextType {
  menuData: MenuData | null;
  isLoading: boolean;
  hasLoaded: boolean;
  hasFeaturedItems: boolean;
  complaintsWhatsapp: string;
  orderSystem: boolean;
  featuredItems: MenuData['items'];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFeaturedItems, setHasFeaturedItems] = useState(false);
  const [complaintsWhatsapp, setComplaintsWhatsapp] = useState("");
  const [orderSystem, setOrderSystem] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<MenuData['items']>([]);

  useEffect(() => {
    let unsubscribeMenu: (() => void) | null = null;

    const initMenu = async () => {
      try {
        const { data } = await MenuService.getMenuWithFallback();
        setMenuData(data);
        const featured = data.items.filter(item => item.star === true && item.visible !== false);
        setHasFeaturedItems(featured.length > 0);
        setFeaturedItems(featured);
        setOrderSystem(data.orderSystem);
        setHasLoaded(true);
        setIsLoading(false);

        // Subscribe to live updates
        unsubscribeMenu = MenuService.subscribeToMenuUpdates((freshData) => {
          setMenuData(freshData);
          const freshFeatured = freshData.items.filter(item => item.star === true && item.visible !== false);
          setHasFeaturedItems(freshFeatured.length > 0);
          setFeaturedItems(freshFeatured);
          setOrderSystem(freshData.orderSystem);
        });
      } catch (err) {
        console.error("Menu Context initialization failed:", err);
        setIsLoading(false);
      }
    };

    initMenu();

    // Complaints Whatsapp fetch
    const complaintsRef = ref(db, "settings/complaintsWhatsapp");
    const unsubComplaints = onValue(complaintsRef, (snapshot) => {
      const value = snapshot.val();
      setComplaintsWhatsapp(value ? String(value).trim() : "");
    });

    return () => {
      if (unsubscribeMenu) unsubscribeMenu();
      unsubComplaints();
    };
  }, []);

  return (
    <MenuContext.Provider value={{ menuData, isLoading, hasLoaded, hasFeaturedItems, complaintsWhatsapp, orderSystem, featuredItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
