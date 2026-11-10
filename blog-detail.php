<?php
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

$default_title = "Treasury Perspectives & Market Insights | Prashanti Forex";
$default_desc = "Outsourced corporate treasury department helping exporters and importers manage currency risk, optimize trade finance, and strengthen liquidity.";
$default_image = "https://prashantiforex.co.in/images/logo.png";
$page_url = "https://prashantiforex.co.in/blog/" . htmlspecialchars($slug);

$title = $default_title;
$desc = $default_desc;
$image = $default_image;

if (!empty($slug)) {
    $api_url = "https://blogs.prashantiforex.co.in/wp-json/wp/v2/posts?slug=" . urlencode($slug) . "&_embed";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'PrashantiForex-Bot/1.0');
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response) {
        $posts = json_decode($response, true);
        if (!empty($posts) && is_array($posts) && isset($posts[0])) {
            $post = $posts[0];
            
            if (!empty($post['title']['rendered'])) {
                $title = html_entity_decode(strip_tags($post['title']['rendered']), ENT_QUOTES, 'UTF-8');
            }

            if (!empty($post['excerpt']['rendered'])) {
                $desc = html_entity_decode(strip_tags($post['excerpt']['rendered']), ENT_QUOTES, 'UTF-8');
                $desc = preg_replace('/\s+/', ' ', trim($desc));
                $desc = mb_strimwidth($desc, 0, 160, "...");
            }

            if (!empty($post['_embedded']['wp:featuredmedia'][0]['source_url'])) {
                $image = $post['_embedded']['wp:featuredmedia'][0]['source_url'];
            }
        }
    }
}

$html_file = __DIR__ . '/news-detail.html';
if (!file_exists($html_file)) {
    die("news-detail.html not found.");
}
$html = file_get_contents($html_file);

$og_meta = '
    <title>' . htmlspecialchars($title) . ' | Prashanti Forex</title>
    <meta name="description" content="' . htmlspecialchars($desc) . '">
    
    <!-- Open Graph / WhatsApp / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Prashanti Forex">
    <meta property="og:title" content="' . htmlspecialchars($title) . '">
    <meta property="og:description" content="' . htmlspecialchars($desc) . '">
    <meta property="og:image" content="' . htmlspecialchars($image) . '">
    <meta property="og:url" content="' . htmlspecialchars($page_url) . '">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="' . htmlspecialchars($title) . '">
    <meta name="twitter:description" content="' . htmlspecialchars($desc) . '">
    <meta name="twitter:image" content="' . htmlspecialchars($image) . '">
';

if (preg_match('/<title>.*?<\/title>/i', $html)) {
    $html = preg_replace('/<title>.*?<\/title>/i', $og_meta, $html, 1);
} else {
    $html = str_replace('<head>', "<head>\n" . $og_meta, $html);
}

echo $html;
exit;