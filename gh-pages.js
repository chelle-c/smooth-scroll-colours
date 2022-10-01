import { publish } from 'gh-pages';

publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/chelle-c/smooth-scroll-colours.git', // Update to point to your repository  
        user: {
            name: 'Chelle Croke', // update to use your name
            email: 'michellelcroke@gmail.com' // Update to use your email
        },
        dotfiles: true
    },
    () => {
        console.log('Deploy Complete!')
    }
)