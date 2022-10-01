var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://chelle-c.github.io/smooth-scroll-colours.git', // Update to point to your repository  
        user: {
            name: 'Chelle Croke', // update to use your name
            email: 'michellelcroke@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)