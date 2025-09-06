// Firebase Vertex AI implementation for L457 project
// Using Firebase AI Logic for secure and simplified access to Gemini models

let vertexAI = null;
let generativeModel = null;

// Initialize Firebase Vertex AI
function initializeFirebaseAI() {
    console.log('🔥 Initializing Firebase Vertex AI...');
    
    try {
        // Check if Firebase modules are available globally
        if (!window.firebaseModules) {
            console.error('❌ Firebase modules not found. Make sure Firebase CDN is loaded.');
            return false;
        }
        
        // Check if Firebase v9+ app is available globally
        if (!window.firebaseAppV9) {
            console.error('❌ Firebase v9+ app not found. Make sure Firebase is initialized.');
            return false;
        }
        
        console.log('✅ Firebase v9+ app found, initializing Vertex AI...');
        
        // Initialize Vertex AI service using global modules
        const { getVertexAI, getGenerativeModel } = window.firebaseModules;
        vertexAI = getVertexAI(window.firebaseAppV9);
        
        // Initialize the generative model (Gemini)
        generativeModel = getGenerativeModel(vertexAI, {
            model: 'gemini-1.5-flash'
        });
        
        console.log('✅ Firebase Vertex AI initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error initializing Firebase Vertex AI:', error);
        return false;
    }
}

// Wait for Firebase modules to be loaded, then initialize AI
function waitForFirebaseModules() {
  console.log('🔍 Checking Firebase modules...', {
    firebaseModulesLoaded: window.firebaseModulesLoaded,
    firebaseModules: !!window.firebaseModules,
    firebaseAppV9: !!window.firebaseAppV9
  });
  
  if (window.firebaseModulesLoaded && window.firebaseModules) {
    console.log('🤖 AI Generator: Starting Firebase Vertex AI initialization...');
    try {
      const success = initializeFirebaseAI();
      if (success) {
        // Initialize AI generator UI
        console.log('🎯 Initializing AI generator UI...');
        initializeAIGenerator();
      } else {
        throw new Error('Failed to initialize Firebase AI');
      }
    } catch (error) {
      console.error('❌ Error initializing Firebase AI:', error);
      // Show error message to user
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 10px; margin: 10px; border-radius: 4px; border: 1px solid #ef5350;';
      errorDiv.textContent = 'AI Generator Error: ' + error.message;
      document.body.insertBefore(errorDiv, document.body.firstChild);
    }
  } else {
    console.log('⏳ Waiting for Firebase modules to load...');
    // Wait for Firebase modules to load
    window.addEventListener('firebaseModulesReady', waitForFirebaseModules, { once: true });
  }
}

// Make function globally available for debugging
window.waitForFirebaseModules = waitForFirebaseModules;

// Initialize AI when the page loads
window.addEventListener('DOMContentLoaded', waitForFirebaseModules);

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', waitForFirebaseModules);
} else {
  // DOM is already loaded, try to initialize now
  console.log('🚀 DOM already loaded, initializing immediately...');
  waitForFirebaseModules();
}

/**
 * Generate an article using Google's Generative AI
 * @param {string} topic - The topic for the article
 * @returns {Promise<string>} - The generated article content
 */
async function generateArticle(topic) {
  try {
    if (!topic || topic.trim() === '') {
      throw new Error('Topic cannot be empty');
    }

    if (!generativeModel) {
      throw new Error('AI model not initialized. Please check your configuration.');
    }

    // Construct a detailed prompt for better article generation
    const prompt = `Write a comprehensive, well-structured article about: ${topic}. 
    
Please include:
- An engaging introduction
- Main content with clear sections
- Relevant examples or details
- A thoughtful conclusion

Make the article informative, accurate, and engaging for readers. Aim for approximately 500-800 words.`;

    console.log('Generating article for topic:', topic);
    
    // Send the prompt to Gemini
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === '') {
      throw new Error('No content generated');
    }

    console.log('Article generated successfully');
    return text;
  } catch (error) {
    console.error('Error generating article:', error);
    throw new Error(`Failed to generate article: ${error.message}`);
  }
}

/**
 * Initialize the AI Article Generator UI
 */
function initializeAIGenerator() {
  const generateButton = document.getElementById('generateArticleBtn');
  const topicInput = document.getElementById('articleTopicInput');
  const outputDiv = document.getElementById('generatedArticleOutput');
  const loadingDiv = document.getElementById('aiLoadingIndicator');
  const useButton = document.getElementById('useGeneratedBtn');
  const regenerateButton = document.getElementById('regenerateBtn');

  if (!generateButton || !topicInput || !outputDiv) {
    console.warn('AI Generator UI elements not found');
    return;
  }

  console.log('AI Generator UI initialized successfully');

  // Generate article button click handler
  generateButton.addEventListener('click', async () => {
    console.log('🔥 Generate button clicked!');
    const topic = topicInput.value.trim();
    console.log('📝 Topic entered:', topic);
    
    if (!topic) {
      alert('Please enter a topic for the article.');
      return;
    }

    try {
      // Show loading state
      generateButton.disabled = true;
      if (loadingDiv) loadingDiv.style.display = 'flex';
      outputDiv.innerHTML = '<div class="placeholder-text">🤖 Generating article...</div>';
      
      // Generate the article
      const article = await generateArticle(topic);
      
      // Display the generated article
      displayGeneratedArticle(article, topic);
      
      // Show action buttons
      if (useButton) useButton.style.display = 'inline-block';
      if (regenerateButton) regenerateButton.style.display = 'inline-block';
      
    } catch (error) {
      console.error('Generation failed:', error);
      outputDiv.innerHTML = `<div class="placeholder-text" style="color: #fca5a5;">❌ ${error.message}</div>`;
    } finally {
      // Hide loading state
      generateButton.disabled = false;
      if (loadingDiv) loadingDiv.style.display = 'none';
    }
  });

  // Use generated article button
  if (useButton) {
    useButton.addEventListener('click', () => {
      const generatedContent = outputDiv.querySelector('.article-content');
      if (generatedContent) {
        // Check if Quill editor is available
        if (typeof quillEditor !== 'undefined' && quillEditor) {
          // Insert into Quill editor
          const content = generatedContent.innerHTML;
          quillEditor.root.innerHTML = content;
        }
        
        // Also update the textarea fallback
        const textarea = document.getElementById('postContent');
        if (textarea) {
          textarea.value = generatedContent.textContent;
        }
        
        alert('✅ Article content has been added to the editor!');
      }
    });
  }

  // Regenerate button
  if (regenerateButton) {
    regenerateButton.addEventListener('click', () => {
      generateButton.click();
    });
  }
}

/**
 * Display the generated article in the output area
 * @param {string} article - The generated article content
 * @param {string} topic - The original topic
 */
function displayGeneratedArticle(article, topic) {
  const outputDiv = document.getElementById('generatedArticleOutput');
  if (!outputDiv) return;

  // Format the article content
  const formattedArticle = formatArticleContent(article);
  
  outputDiv.innerHTML = `
    <div class="generated-article">
      <h3>📝 Generated Article: ${topic}</h3>
      <div class="article-content">${formattedArticle}</div>
      <div class="article-meta">
        Generated on ${new Date().toLocaleString()} • ${article.length} characters
      </div>
    </div>
  `;
}

/**
 * Format article content for better display
 * @param {string} content - Raw article content
 * @returns {string} - Formatted HTML content
 */
function formatArticleContent(content) {
  // Basic formatting: convert line breaks to paragraphs
  return content
    .split('\n\n')
    .filter(paragraph => paragraph.trim())
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
}