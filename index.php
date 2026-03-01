<?php
/**
 * Dynamic Tool/Game Card Generator for FOSSarium
 */

// Global cache for metadata
$GLOBALS['project_metadata'] = null;

function getProjectMetadata()
{
    if ($GLOBALS['project_metadata'] === null) {
        $infoPath = __DIR__ . '/info.json';
        if (file_exists($infoPath)) {
            $GLOBALS['project_metadata'] = json_decode(file_get_contents($infoPath), true);
        } else {
            $GLOBALS['project_metadata'] = [];
        }
    }
    return $GLOBALS['project_metadata'];
}

function generateCategoryGrid($targetCategory)
{
    $html = "";
    $index = 1;
    $metadata = getProjectMetadata();

    foreach ($metadata as $folderName => $info) {
        $category = isset($info['category']) ? $info['category'] : '';

        if ($category === $targetCategory) {
            $title = isset($info['title']) ? $info['title'] : ucwords(str_replace('-', ' ', $folderName));
            $description = isset($info['description']) ? $info['description'] : "Modern FOSS tool.";
            $icon = isset($info['icon-name']) ? $info['icon-name'] : 'cube-outline';
            $credit = isset($info['credit']) ? $info['credit'] : "";

            // Path depends on the category directory
            $path = $targetCategory . '/' . $folderName . '/index.html';

            $gradientClass = "gradient-" . (($index % 9) + 1);
            $creditHtml = $credit ? '<div class="card-credit">Credit: ' . htmlspecialchars($credit) . '</div>' : '';

            $html .= '                    <a href="' . $path . '" class="item-card" data-title="' . htmlspecialchars($title) . '">
                        ' . $creditHtml . '
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
    <title>FOSSarium - Premium FOSS Collection</title>
    <!-- Modern Font: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="main.css">
    <link rel="icon" href="./icon.png">
    <!-- Ionicons for beautiful icons -->
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>

<body>
    <script>
        // Prevent FOUC (Flash of Unstyled Content) by setting theme immediately
        const savedTheme = localStorage.getItem('fossarium-theme');
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
                <img src="icon.png" alt="FOSSarium Logo" class="logo-img">
                <h1>FOSSarium</h1>
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