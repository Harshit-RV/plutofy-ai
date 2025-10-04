import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "./ThemeContext";

const AntdConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#087e8b',
          borderRadius: 2,
        },
        components: {
          Menu: {
            itemBg: theme === 'dark' ? '#1f2937' : '#fafafa',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;