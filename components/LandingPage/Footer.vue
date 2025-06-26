<template>

  <footer class="p-4 mt-auto w-full border-t border-neutral-800 md:p-6">

    <section
      class="w-full max-w-8xl mx-auto flex flex-col items-center gap-4 text-sm text-neutral-400
             md:flex-row md:justify-between md:items-center"
    >

      <p class="text-center md:text-left w-full md:w-auto">
        Released under the MIT License
      </p>

      <ul class="flex flex-col gap-1 items-center w-full md:items-end md:w-auto">

        <li>
          <ULink
            to="https://github.com/favorodera"
            target="_blank"
            class="text-sm underline underline-offset-2"
          >
            Created by Favour
          </ULink>
        </li>

        <li>
          <p>
            Copyright &copy; {{ new Date().getFullYear() }} KeepDotDev
          </p>
        </li>

      </ul>

    </section>

  </footer>

</template>
