<template>

  <footer class="p-4 mt-auto w-full border-t border-default">

    <section
      class="flex flex-col gap-4 items-center mx-auto w-full text-sm max-w-8xl text-muted md:flex-row md:justify-between md:items-center"
    >

      <p class="w-full text-center md:text-left md:w-auto">
        Released under the MIT License
      </p>

      <div class="flex flex-col gap-1 items-center w-full md:items-end md:w-auto">

        <ULink
          to="https://github.com/favorodera"
          target="_blank"
          class="text-sm underline underline-offset-2"
        >
          Built by Favour
        </ULink>

        <p>
          Copyright &copy; {{ new Date().getFullYear() }} KeepDotDev
        </p>

      </div>

    </section>

  </footer>

</template>
