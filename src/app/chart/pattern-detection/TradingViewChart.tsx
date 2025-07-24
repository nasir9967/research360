import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  exchange: string;
}

const getFeedUrl = (exchange: string) => {
  return exchange === 'NSE'
    ? 'https://research360api.motilaloswal.com/api/getcharts'
    : 'https://research360api.motilaloswal.com/api/getBSEcharts';
};

export default function TradingViewChart({ symbol, exchange }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove previous widget if any
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Load TradingView scripts
    const script1 = document.createElement('script');
    script1.src = 'https://www.research360.in/chartingLib/charting_library/charting_library.standalone.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://www.research360.in/chartingLib/datafeeds/udf/dist/bundle.js';
    script2.async = true;
    document.body.appendChild(script2);

    script2.onload = () => {
      // @ts-ignore
      if (window.TradingView && window.Datafeeds) {
        // @ts-ignore
        new window.TradingView.widget({
          debug: false,
          fullscreen: false,
          symbol: symbol,
          exchange: exchange,
          interval: symbol === 'PAYTM' ? '30' : '1D',
          container: containerRef.current,
          timezone: 'Asia/Kolkata',
          autosize: true,
          datafeed: new window.Datafeeds.UDFCompatibleDatafeed(getFeedUrl(exchange)),
          library_path: 'https://www.research360.in/chartingLib/charting_library/',
          locale: 'en',
          disabled_features: [
            'adaptive_logo',
            'go_to_date',
            'create_volume_indicator_by_default',
            'header_symbol_search',
            'header_compare',
            'header_fullscreen_button',
            'timezone_menu',
          ],
          enabled_features: ['hide_left_toolbar_by_default', 'study_templates'],
          charts_storage_url: 'https://saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user_id',
          theme: 'light',
          time_frames: [
            { text: '1D', resolution: '1' },
            { text: '5D', resolution: '5' },
            { text: '1M', resolution: '30' },
            { text: '3M', resolution: '1D' },
            { text: '6M', resolution: '1D' },
            { text: '1Y', resolution: '1D' },
            { text: '5Y', resolution: 'W' },
            { text: '10Y', resolution: 'M', description: 'Max', title: 'Max' },
          ],
          favorites: {
            intervals: ['1', '5', '15', '30', '1h', '1D'],
            chartTypes: ['Area', 'Candles'],
          },
        });
      }
    };

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [symbol, exchange]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: 320, minHeight: 320 }} />
  );
}
