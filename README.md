[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]




<br />
<div align="center">

<h1 align="center">Sudoku Solver</h1>

  <p align="center">
    This is an algorithm I designed to quickly solve even the most difficult sudoku puzzles using a backtracking algorithm. 
    <br />
    <a href="https://github.com/amhaag/sudoku-solver"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/amhaag/sudoku-solver">View Demo</a>
    ·
    <a href="https://github.com/amhaag/sudoku-solver/issues">Report Bug</a>
    ·
    <a href="https://github.com/amhaag/sudoku-solver/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#how-it-works">How it Works</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This project started as a fascination with tree traversal and to try my hand at creating a recursive algorithm from scratch. While there are many sudoku solvers out there, this served as a learning by experiment. 

The algorithm itself is written in Javascript and the front end was built as a means to visually display its capabilities. 


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites


* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/amhaag/sudoku-solver.git
   ```
2. Spin up the develoment environment
      ```sh
   npm run dev
   ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## How It Works

The function begins by finding all cells that have a definite answer and entering that answer. It will keep going through the board until it a completes a full iteration with no new values found. It then finds the cell with the fewest possibilities and implements a guess and then recursively calls the function. It will continue to work assuming that the guess was correct until the entire board is full and the solutionis validated or until it is impossible to contiune. If it is impossible to continue it will work back up the tree trying alternate guesses. 



<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- CONTRIBUTING -->
## Contributing

While not built to be anything more than practice, contributions are welcome. If you'd like to contribute please follow the steps below. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Aaron Haag - [@aaronmhaag](https://twitter.com/aaronmhaag) - aaronm.haag@gmail.com

Project Link: [https://github.com/amhaag/sudoku-solver](https://github.com/amhaag/sudoku-solver)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [The T3 Community](https://create.t3.gg/)
  * For being an excellent place to get and stay excited about wed development.
* [otheneildrew](https://github.com/othneildrew/Best-README-Template)
  * for creating this excellent read me template

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/amhaag/sudoku-solver.svg?style=for-the-badge
[contributors-url]: https://github.com/amhaag/sudoku-solver/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/amhaag/sudoku-solver.svg?style=for-the-badge
[forks-url]: https://github.com/amhaag/sudoku-solver/network/members
[stars-shield]: https://img.shields.io/github/stars/amhaag/sudoku-solver.svg?style=for-the-badge
[stars-url]: https://github.com/amhaag/sudoku-solver/stargazers
[issues-shield]: https://img.shields.io/github/issues/amhaag/sudoku-solver.svg?style=for-the-badge
[issues-url]: https://github.com/amhaag/sudoku-solver/issues
[license-shield]: https://img.shields.io/github/license/amhaag/sudoku-solver.svg?style=for-the-badge
[license-url]: https://github.com/amhaag/sudoku-solver/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/aaron-haag
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
