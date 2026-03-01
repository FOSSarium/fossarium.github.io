<?php
/**
 * Dynamic Tool/Game Card Generator for Spectrum
 */
function generateCategoryGrid($directory)
{
    if (!is_dir($directory))
        return "";

    $items = array_diff(scandir($directory), array('..', '.'));
    $html = "";
    $index = 1;

    // Icon mapping based on common keywords in folder names
    $iconMap = [
        'calc' => 'calculator-outline',
        'generator' => 'key-outline',
        'editor' => 'create-outline',
        'timer' => 'timer-outline',
        'clock' => 'time-outline',
        'converter' => 'swap-horizontal-outline',
        'picker' => 'color-palette-outline',
        'formatter' => 'code-slash-outline',
        'tester' => 'search-outline',
        'tracker' => 'checkbox-outline',
        'game' => 'game-controller-outline',
        'puzzle' => 'grid-outline',
        'quiz' => 'help-circle-outline',
        'board' => 'clipboard-outline',
        'list' => 'list-outline',
        'note' => 'document-text-outline',
        'text' => 'text-outline',
        'code' => 'code-working-outline',
        'link' => 'link-outline',
        'image' => 'image-outline',
        'color' => 'color-fill-outline',
        'shield' => 'shield-checkmark-outline',
        'speed' => 'speedometer-outline',
        'radar' => 'radio-outline',
        'wifi' => 'wifi-outline',
        'lock' => 'lock-closed-outline',
        'user' => 'person-outline',
        'card' => 'card-outline',
        'weather' => 'cloud-outline',
        'music' => 'musical-notes-outline',
        'video' => 'videocam-outline',
        'camera' => 'camera-outline',
        'map' => 'map-outline',
        'trash' => 'trash-outline',
        'settings' => 'settings-outline',
        'tool' => 'construct-outline',
        'snake' => 'analytics-outline',
        'tic-tac-toe' => 'grid-outline',
        'pong' => 'tennisball-outline',
        'search' => 'search-outline',
        'download' => 'download-outline',
        'upload' => 'upload-outline',
        'mail' => 'mail-outline',
        'chat' => 'chatbubble-outline',
        'calendar' => 'calendar-outline',
        'stats' => 'stats-chart-outline',
        'chart' => 'pie-chart-outline',
        'battery' => 'battery-charging-outline',
        'heart' => 'heart-outline',
        'star' => 'star-outline',
        'home' => 'home-outline',
        'folder' => 'folder-open-outline',
        'file' => 'document-outline',
        'print' => 'print-outline',
        'volume' => 'volume-medium-outline',
        'mic' => 'mic-outline',
        'flash' => 'flash-outline',
        'location' => 'location-outline',
        'eye' => 'eye-outline',
        'notification' => 'notifications-outline',
        'info' => 'information-circle-outline',
        'help' => 'help-circle-outline',
        'refresh' => 'refresh-outline',
        'share' => 'share-social-outline',
        'save' => 'save-outline',
        'archive' => 'archive-outline',
        'hash' => 'finger-print-outline',
        'json' => 'braces-outline',
        'unit' => 'layers-outline',
        'currency' => 'cash-outline',
        'diff' => 'git-compare-outline',
        'regex' => 'terminal-outline',
        'uuid' => 'finger-print-outline',
        'password' => 'keypad-outline'
    ];

    foreach ($items as $item) {
        $path = $directory . '/' . $item;
        if (is_dir($path) && file_exists($path . '/index.html')) {
            $title = ucwords(str_replace('-', ' ', $item));
            $description = "Modern FOSS tool.";
            $fileContent = file_get_contents($path . '/index.html');
            if (preg_match('/<p class="tool-subtitle">(.*?)<\/p>/s', $fileContent, $matches)) {
                $description = trim(strip_tags($matches[1]));
            } elseif (preg_match('/<p>(.*?)<\/p>/s', $fileContent, $matches)) {
                $description = trim(strip_tags($matches[1]));
            }

            $icon = 'cube-outline';
            foreach ($iconMap as $key => $val) {
                if (strpos($item, $key) !== false) {
                    $icon = $val;
                    break;
                }
            }
            $gradientClass = "gradient-" . (($index % 9) + 1);
            $html .= '                    <a href="' . $directory . '/' . $item . '/index.html" class="item-card" data-title="' . htmlspecialchars($title) . '">
                        <div class="card-icon ' . $gradientClass . '"><ion-icon name="' . $icon . '"></ion-icon></div>
                        <div class="card-content">
                            <h3>' . htmlspecialchars($title) . '</h3>
                            <p>' . htmlspecialchars($description) . '</p>
                        </div>
                    </a>' . "\n";
            $index++;
        }
    }
    return $html;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spectrum - Premium FOSS Collection</title>
    <!-- Modern Font: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="main.css">
    <!-- Ionicons for beautiful icons -->
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>

<body>
    <script>
        // Prevent FOUC (Flash of Unstyled Content) by setting theme immediately
        const savedTheme = localStorage.getItem('spectrum-theme');
        if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
            document.documentElement.classList.add('light-theme');
        }
    </script>
    <div class="background-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
    </div>

    <div class="theme-toggle-container">
        <button id="theme-toggle" title="Toggle Light/Dark Theme">
            <ion-icon name="sunny-outline"></ion-icon>
        </button>
    </div>

    <div class="app-container">
        <header class="app-header">
            <div class="logo-container">
                <ion-icon name="infinite-outline" class="logo-icon"></ion-icon>
                <h1>Spectrum</h1>
            </div>
            <p class="subtitle">The ultimate, ever-growing FOSS library.</p>

            <div class="search-container">
                <ion-icon name="search-outline"></ion-icon>
                <input type="text" id="searchInput" placeholder="Search games and tools...">
            </div>
        </header>

        <main class="app-main">
            <!-- Tools Section -->
            <section class="category-section" id="tools-section">
                <div class="section-header">
                    <h2><ion-icon name="hammer-outline"></ion-icon> Tools</h2>
                </div>
                <div class="item-grid" id="tools-grid">
                    <?php echo generateCategoryGrid('tools'); ?>
                </div>
            </section>

            <!-- Games Section -->
            <section class="category-section" id="games-section">
                <div class="section-header">
                    <h2><ion-icon name="game-controller-outline"></ion-icon> Games</h2>
                </div>
                <div class="item-grid" id="games-grid">
                    <?php echo generateCategoryGrid('games'); ?>
                </div>
            </section>
        </main>

        <footer class="app-footer">
            <p>Made with ❤ by FOSSarium &bull; <a href="https://github.com/fossarium" target="_blank"><ion-icon
                        name="logo-github"></ion-icon> FOSSarium on GitHub</a></p>
        </footer>

    </div>

    <script src="main.js"></script>
</body>

</html>