/**
 * test/utils/datadog-reporter.ts
 * - Sends test metrics to Datadog
 * - Tracks API response metrics
 * - Useful for monitoring and trending
 */

interface MetricTag {
  [key: string]: string;
}

export async function sendTestMetrics(
  metricValue: number,
  metricName: string,
  tags: string[] = []
): Promise<void> {
  const datadogApiUrl = process.env.DATADOG_API_URL;
  const datadogApiKey = process.env.DATADOG_API_KEY;

  // If Datadog not configured, just log
  if (!datadogApiUrl || !datadogApiKey) {
    console.log(
      `[Datadog] Would send metric: ${metricName} = ${metricValue} with tags: ${tags.join(', ')}`
    );
    return;
  }

  try {
    const payload = {
      series: [
        {
          metric: metricName,
          points: [[Math.floor(Date.now() / 1000), metricValue]],
          type: 'gauge',
          tags: tags
        }
      ]
    };

    const response = await fetch(`${datadogApiUrl}/api/v1/series`, {
      method: 'POST',
      headers: {
        'DD-API-KEY': datadogApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`[Datadog] Failed to send metric: ${response.status}`);
    }
  } catch (error) {
    console.warn('[Datadog] Error sending metrics:', error instanceof Error ? error.message : String(error));
  }
}
